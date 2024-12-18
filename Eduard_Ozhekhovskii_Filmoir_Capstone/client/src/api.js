import axios from 'axios';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getF = async () => {
  try {
    const res = await axios.get(`${URL}/folders`);
    return res.data;
  } catch (err) {
    console.error('❌ err get 📂', err);
    return [];
  }
};

export const createF = async (fData) => {
  try {
    const res = await axios.post(`${URL}/folders`, fData);
    return res.data;
  } catch (err) {
    console.error('❌ err create 📂', err);
    return null;
  }
};

export const searchMvs = async (q) => {
  try {
    const res = await axios.get(`${URL}/search?query=${q}`);
    return res.data;
  } catch (err) {
    console.error('❌ err search 🎬', err);
    return [];
  }
};

export const addMvToF = async (fUrl, mvData) => {
  try {
    const res = await axios.post(`${URL}/folders/${fUrl}`, mvData);
    return res.data;
  } catch (err) {
    console.error('❌ err add 🎬 to 📂', err);
    return null;
  }
};

export const getRandFromF = async (fId) => {
  try {
    const res = await axios.get(`${URL}/folders/${fId}/random`);
    return res.data;
  } catch (err) {
    console.error('❌ err fetch random 🎬 from 📂', err);
    return null;
  }
};

export const getRandFromA = async () => {
  try {
    const res = await axios.get(`${URL}/all/random`);
    return res.data;
  } catch (err) {
    console.error('❌ err fetch random 🎬 from all', err);
    return null;
  }
};

export const getMvsFromF = async (fId) => {
  try {
    const res = await axios.get(`${URL}/folders/${fId}`);
    return res.data;
  } catch (err) {
    console.error('❌ err get 🎬 from 📂', err);
    return { movies: [] };
  }
};

export const delMfromF = async (fUrl, mId) => {
  try {
    const res = await axios.delete(`${URL}/folders/${fUrl}/${mId}`);
    return res.data;
  } catch (err) {
    console.error('❌ err remove 🎬 from 📂', err);
    throw err;
  }
};