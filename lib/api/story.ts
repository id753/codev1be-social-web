import { Story } from '@/types/story';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSingleStory = async (id: string): Promise<Story> => {
  try {
    const res = await axios.get<Story>(`${BASE_URL}/api/stories/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
