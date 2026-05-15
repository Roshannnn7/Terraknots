'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/lib/api';

const MAX_IMAGES = 15;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function ImageUploader({ images, setImages }) {
    const fileInputRef = useRef(null);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error(`Invalid format: ${file.name}. Only JPG, PNG, WEBP, GIF allowed.`);
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File too large: ${file.name}. Max size is 10MB.`);
            return false;
        }
        return true;
    };

    const handleFiles = async (files) => {
        const newFiles = Array.from(files).filter(validateFile);
        
        if (images.length + newFiles.length > MAX_IMAGES) {
            toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
            newFiles.splice(MAX_IMAGES - images.length);
        }

        if (newFiles.length === 0) return;

        const uploadTasks = newFiles.map((file) => {
            const id = Math.random().toString(36).substring(7);
            const task = { id, file, progress: 0, preview: URL.createObjectURL(file) };
            return task;
        });

        setUploadingFiles((prev) => [...prev, ...uploadTasks]);

        for (const task of uploadTasks) {
            const formData = new FormData();
            formData.append('image', task.file);

            try {
                const { data } = await api.post('/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadingFiles((prev) => 
                            prev.map((t) => t.id === task.id ? { ...t, progress: percentCompleted } : t)
                        );
                    }
                });
                
                setImages((prev) => [...prev, data.url]);
                
                setUploadingFiles((prev) => prev.filter((t) => t.id !== task.id));
            } catch (error) {
                toast.error(`Failed to upload ${task.file.name}`);
                setUploadingFiles((prev) => prev.filter((t) => t.id !== task.id));
            }
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-heading font-bold text-dark">Visual Backdrop</h3>
                <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {images.length} of {MAX_IMAGES} images uploaded
                </span>
            </div>

            {/* Dropzone */}
            {images.length < MAX_IMAGES && (
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                    }`}
                >
                    <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                        <Upload size={32} className={isDragging ? 'text-primary' : 'text-gray-400'} />
                    </div>
                    <p className="text-sm font-bold text-dark text-center">
                        Drag & Drop images here <br />
                        <span className="text-xs font-normal text-light mt-1 inline-block">or click to browse</span>
                    </p>
                    <p className="text-[10px] text-light mt-4 uppercase tracking-widest font-bold">
                        JPG, PNG, WEBP, GIF (Max 10MB)
                    </p>
                    <input
                        type="file"
                        multiple
                        hidden
                        ref={fileInputRef}
                        onChange={(e) => handleFiles(e.target.files)}
                        accept="image/jpeg, image/png, image/webp, image/gif"
                    />
                </div>
            )}

            {/* Image Grid with Drag to Reorder */}
            {images.length > 0 && (
                <div className="mt-8">
                    <p className="text-[10px] text-light italic mb-4">Drag thumbnails left and right to reorder.</p>
                    <Reorder.Group 
                        axis="x" 
                        values={images} 
                        onReorder={setImages} 
                        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar"
                    >
                        <AnimatePresence>
                            {images.map((img, idx) => (
                                <Reorder.Item
                                    key={img}
                                    value={img}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-gray-100 hover:border-primary/30 transition-colors shadow-sm group bg-white"
                                >
                                    <img src={img} alt="Product" className="w-full h-full object-cover pointer-events-none" />
                                    
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 z-10"
                                    >
                                        <X size={14} />
                                    </button>

                                    {idx === 0 && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-sm z-10">
                                            Main Photo
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                </div>
            )}

            {/* Uploading Previews */}
            {uploadingFiles.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h4 className="text-xs font-bold text-dark uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Uploading
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {uploadingFiles.map((file) => (
                            <div key={file.id} className="relative flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden border border-gray-200">
                                <img src={file.preview} alt="preview" className="w-full h-full object-cover opacity-40 blur-sm" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="w-12 h-12 relative">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/20" />
                                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - file.progress / 100)}`} className="text-white transition-all duration-300" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                                            {file.progress}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
