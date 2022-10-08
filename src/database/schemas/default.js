const getAll = async ({ model, filter, attributes, sort, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.findAll({
        where: filter || {},
        attributes: attributes || null,
        sort: sort || [],
        include: include,
      });

      if (data.length == 0) resolve(null);

      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const getOne = async ({ model, filter, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.findOne({
        where: filter || {},
        attributes: attributes || null,
        //     raw: true,
        include: include,
      });
      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const createOne = async ({ model, data, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await model.create(data, { raw: true, include: include });
      resolve(result);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const updateOne = async ({ model, filter, data, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [, count] = await model.update(data, {
        where: filter || {},
        returning: true,
        plain: true,
        raw: true,
        include: include,
      });
      resolve(count);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const deleteOne = async ({ model, filter }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.destroy({
        where: filter || {},
        returning: true,
        plain: true,
        raw: true,
      });

      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

const getOnePk = async ({ pk, model, filter, attributes, include }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await model.findByPk(pk, {
        where: filter || {},
        attributes: attributes || null,
        //  raw: true,
        include: include,
      });
      resolve(data);
    } catch (error) {
      reject(error?.original || error?.message || error);
    }
  });
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getOnePk,
};
