'use client';

import { useState, useEffect } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import { useParams } from 'next/navigation';

const EditProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/id/${id}`);
                setProduct(data.product);
            } catch (error) {
                console.error('Error fetching product', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <Loader />;
    if (!product) return <div>Product not found.</div>;

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Refine Treasure</h1>
                <p className="text-light italic font-accent text-lg">Updating details for "{product.name}"</p>
            </div>
            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
};

export default EditProductPage;
