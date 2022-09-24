export interface FilmInterface {
  id: string,
  count: number,
  price: number,
  description: string,
  title: string,
  imageSrc: string,
}

export interface FilmServiceInterface {
  getFilmList: () => Promise<FilmInterface[]>,
  getFilmById: (id: string) => Promise<FilmInterface>
}