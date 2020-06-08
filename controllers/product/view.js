const httpStatus = require('http-status');
const { pick } = require('lodash');
const { Product } = require('../../models');

/**
 * Create a Product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (req, res) => {
  const data = req.body;
  if (await Product.isNameExists(data.name)) {
    res.status(httpStatus.BAD_REQUEST).send({ 'name': 'name already exists' });
  }
  const product = await Product.create(data);
  res.status(httpStatus.CREATED).send({ ...product });
};

/**
 * Update Product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    let product = await Product.findById(productId);
    console.log('await product', product);
    if (!product) {
      res.status(httpStatus.BAD_REQUEST).send({ 'message': 'Invalid product id' });
    }
    if (await Product.isNameExists(data.name, productId)) {
      res.status(httpStatus.BAD_REQUEST).send({ 'name': 'name already exists' });
    }
    product = await Product.findByIdAndUpdate(productId, { '$set': data });
    console.log('product', product);
    res.status(httpStatus.OK).send({ ...product });
  } catch {
    res.status(httpStatus.BAD_REQUEST).send({ 'message': 'Invalid product id' });
  }
};

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductByID = async (req, res) => {
  const productId = req.params.id;
  try {
    data = await Product.findById(productId).populate('category');
    if (!data) {
      res.status(httpStatus.BAD_REQUEST).send({ 'message': 'Invalid product id' });
    }
    res.status(httpStatus.OK).send({ data });
  } catch {
    res.status(httpStatus.BAD_REQUEST).send({ 'message': 'Invalid product id' });
  }
};


/**
 * Delete Product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    product = await Product.findById(productId);
    if (!product) {
      res.status(httpStatus.BAD_REQUEST).send({ 'message': 'Invalid product id' });
    }
    await product.remove();
    res.status(httpStatus.OK).send({ 'message': 'Delete Successfull' });
  } catch {
    res.status(httpStatus.BAD_REQUEST).send({ 'message': 'Invalid product id' });
  }
};

/**
 * Query for Products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const listProducts = async (req, res) => {
  try {
    const search = req.query.search;
    const price = pick(req.query, ['from_price', 'to_price']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const sort = {};

    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    // for search of name or category name
    let filter = {};
    if (search) {
      // { "category.name": new RegExp(search, "i") }
      filter = { ...filter, ...{ $or: [{ 'name': new RegExp(search, 'i') }] } };
    }
    // for net price filter
    let price$ = {};
    if (price.from_price) {
      price$['$gte'] = parseFloat(price.from_price);
    }
    if (price.to_price) {
      price$['$lte'] = parseFloat(price.to_price);
    }
    if ((Object.keys(price$).length !== 0)) {
      filter['net_price'] = price$;
    }
    const countPromise = Product.countDocuments(filter).exec();
    const docsPromise = Product.find(filter).populate({ path: 'category', select: 'name' }).sort(sort).skip(skip).limit(limit).exec();
    // const docsPromise = Product.find(filter).populate({ path: 'category', match: { $name: 'new' } }).sort(sort).skip(skip).limit(limit).exec();
    Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalCounts, results] = values;
      const totalPages = Math.ceil(totalCounts / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalCounts,
      };
      return res.status(httpStatus.OK).send({ ...result });
    });
  } catch {
    const result = {
      results: [],
      page: 1,
      limit: 10,
      totalPages: 0,
      totalCounts: 0,
    };
    return res.status(httpStatus.OK).send({ ...result });
  }
};


module.exports = {
  listProducts,
  createProduct,
  editProduct,
  getProductByID,
  deleteProduct,
};
