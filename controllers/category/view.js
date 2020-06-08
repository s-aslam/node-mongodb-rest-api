const httpStatus = require('http-status');
const { pick } = require('lodash');
const { Category } = require('../../models');

/**
 * Create a Category
 * @param {Object} body
 * @returns {Promise<Category>}
 */
const createCategory = async (req, res) => {
  const data = req.body;
  if (await Category.isNameExists(data.name)) {
    res.status(httpStatus.BAD_REQUEST).send({ 'name': 'name already exists' });
  }
  const category = await Category.create(data);
  res.status(httpStatus.CREATED).send({ ...category });
};

/**
 * Update Category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const editCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const data = req.body;
    let category = await Category.findById(categoryId);
    if (!category) {
      res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Invalid category id' });
    }
    if ((await Category.isNameExists(data.name, categoryId))) {
      res.status(httpStatus.BAD_REQUEST).send({ 'name': 'name already exists' });
    }
    category = await Category.findByIdAndUpdate(categoryId, { '$set': data });
    res.status(httpStatus.OK).send({ ...category });
  } catch(error) {
    res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Invalid category id' });
  }
};

/**
 * Get Category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryByID = async (req, res) => {
  const categoryId = req.params.id;
  try {
    data = await Category.findById(categoryId);
    if (!data) {
      res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Invalid category id' });
    }
    res.status(httpStatus.OK).send({ data });
  } catch {
    res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Invalid category id' });
  }
};


/**
 * Delete Category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    category = await Category.findById(categoryId);
    if (!category) {
      res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Invalid category id' });
    }
    await category.remove();
    res.status(httpStatus.OK).send({ 'message': 'Delete Successfull' });
  } catch {
    res.status(httpStatus.BAD_REQUEST).send({ 'error': 'Invalid category id' });
  }
};

/**
 * Query for Category
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const listCategory = async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const data = await Category.paginate(filter, options);
  res.status(httpStatus.OK).send({ ...data });
};

const listAllCategory = async (req, res) => {
  const data = await Category.find();
  res.status(httpStatus.OK).send({ data });
};


module.exports = {
  listAllCategory,
  listCategory,
  createCategory,
  editCategory,
  getCategoryByID,
  deleteCategory,
};
