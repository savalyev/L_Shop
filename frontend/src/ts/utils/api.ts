/**
 * Разбирает тело ответа сервера в JSON.
 * Если сервер оборачивает данные в поле `data`, возвращает его содержимое.
 * @param {Response} res Объект ответа от fetch.
 * @returns {Promise<T>} Промис с разобранными данными нужного типа.
 */
export async function responseToJson<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    const data = JSON.parse(text);
    return (data.data !== undefined ? data.data : data) as T;
  } catch {
    return {} as T;
  }
}