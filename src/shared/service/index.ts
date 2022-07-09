import axios from 'axios'
export const getDataAsync = async (url: string) => {
  const response = await axios.get(url)
  console.log(response.data.ass)
  return response.data.assets;
}

