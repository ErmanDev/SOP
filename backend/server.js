const productRoutes = require('./routes/productRoute');
const discountRoutes = require('./routes/discountRoute');
const payrollRoutes = require('./routes/payrollRoute');

app.use('/api/products', productRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/payrolls', payrollRoutes);
