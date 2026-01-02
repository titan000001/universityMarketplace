
const Joi = require('joi');
const { productSchema, orderSchema } = require('../../validators/commonValidator');

describe('Common Validators', () => {
    describe('productSchema', () => {
        it('should validate a valid product', () => {
            const product = {
                title: 'Test Product',
                description: 'A test product description that is long enough',
                price: 100,
                categories: [1, 2],
                tags: 'tag1, tag2',
                location_name: 'Library',
                latitude: 10.5,
                longitude: 20.5,
                shop_id: 1
            };
            const { error } = productSchema.validate(product);
            expect(error).toBeUndefined();
        });

        it('should fail if title is missing', () => {
            const product = {
                description: 'A test product',
                price: 100
            };
            const { error } = productSchema.validate(product);
            expect(error).toBeDefined();
        });

        it('should fail if description is too short', () => {
             const product = {
                title: 'Test Product',
                description: 'Short',
                price: 100
            };
            const { error } = productSchema.validate(product);
            expect(error).toBeDefined();
        });
    });

    describe('orderSchema', () => {
        it('should validate a valid order', () => {
            const order = {
                items: [
                    { id: 1, price: 100 },
                    { id: 2 }
                ]
            };
            const { error } = orderSchema.validate(order);
            expect(error).toBeUndefined();
        });

        it('should fail if items are missing', () => {
            const order = {};
            const { error } = orderSchema.validate(order);
            expect(error).toBeDefined();
        });

        it('should fail if items array is empty', () => {
            const order = { items: [] };
            const { error } = orderSchema.validate(order);
            expect(error).toBeDefined();
        });
    });
});
