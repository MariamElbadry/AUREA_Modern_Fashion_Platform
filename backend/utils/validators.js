// Allowed fields for product creation and updates
const allowedProductFields = [
  'Id',
  'name',
  'price',
  'catId',
  'imageUrl',
  'quantity',
  'designer',
  'isRent',
  'isNew'
];

// Allowed fields for category creation and updates
const allowedCategoryFields = [
  'id',
  'name',
  'description'
];

// Filter request body to only include allowed fields
const filterFields = (body, allowedFields) => {
  const filtered = {};
  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      filtered[field] = body[field];
    }
  });
  return filtered;
};

module.exports = {
  allowedProductFields,
  allowedCategoryFields,
  filterFields
};
