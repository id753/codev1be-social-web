import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import serverApi from '@/app/api/api';

export async function POST() {
  const cookieStore = await cookies();

  try {
    // Відправляємо запит на логаут до бекенду.
    // Interceptor у serverApi сам додасть куки до запиту.
    await serverApi.post('/auth/logout');
  } catch (error) {
    // Якщо бекенд недоступний, ми просто логуємо це і йдемо далі чистити фронтенд
    if (isAxiosError(error)) {
      console.error('Backend logout failed:', error.response?.data);
    }
  }

  // Створюємо відповідь
  const response = NextResponse.json(
    { message: 'Logged out' },
    { status: 200 },
  );

  // Список кук, які треба видалити
  const cookiesToDelete = ['accessToken', 'refreshToken', 'sessionId'];

  // Видаляємо куки через cookieStore (це змінить заголовки відповіді автоматично)
  cookiesToDelete.forEach((name) => {
    cookieStore.delete(name);
  });

  return response;
}
