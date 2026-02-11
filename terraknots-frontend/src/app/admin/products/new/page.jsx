'use client';

import ProductForm from '@/components/admin/ProductForm';

const NewProductPage = () => {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-heading font-bold text-dark">Add New Piece</h1>
                <p className="text-light italic font-accent text-lg">List a new creation in the TerraKnots collection.</p>
            </div>
            <ProductForm />
        </div>
    );
};

export default NewProductPage;
