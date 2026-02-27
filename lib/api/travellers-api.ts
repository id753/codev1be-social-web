import axios from "axios";
import { User } from "@/types/user";
import { Story } from "@/types/story";

interface TravellersResponse {
  page: number;
  perPage: number;
  totalAuthors: number;
  totalPages: number;
  users: User[];
}

interface GetTravellersParams {
  page?: number;
  perPage?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Всі мандрівники
export async function getTravellers(
  params: GetTravellersParams
): Promise<TravellersResponse> {
  try {
    const res = await axios.get<TravellersResponse>(`${BASE_URL}/api/users`, {
      params: {
        page: params.page,
        perPage: params.perPage,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to load travellers", error);
    throw new Error("Failed to load travellers");
  }
}

// Один мандрівник по id
export async function getTravellerById(travellerId: string): Promise<User> {
  try {
    const res = await axios.get<{ user: User }>(`${BASE_URL}/api/users/${travellerId}`);
    return res.data.user;
  } catch (error) {
    console.error(`Failed to load traveller with id ${travellerId}`, error);
    throw new Error("Failed to load traveller");
  }
}

// Історії мандрівника з серверною пагінацією
interface TravellersStoriesResponse {
  page: number;
  perPage: number;
  totalStories: number;
  totalPages: number;
  stories: Story[];
}

export async function getTravellersStories({
  travellerId,
  page = 1,
  perPage = 6,
}: {
  travellerId: string;
  page?: number;
  perPage?: number;
}): Promise<TravellersStoriesResponse> {
  try {
    const res = await axios.get<TravellersStoriesResponse>(`${BASE_URL}/api/stories`, {
      params: { travellerId, page, perPage },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to load traveller stories", error);
    throw new Error("Failed to load traveller stories");
  }
}


