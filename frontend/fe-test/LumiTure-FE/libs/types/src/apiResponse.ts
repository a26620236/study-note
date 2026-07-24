export interface ResponseGenerics<Data = unknown> {
  data: Data;
  message: string;
  success: boolean;
}

export interface ResponseListGenerics<Data = unknown> extends ResponseGenerics<Data> {
  meta: {
    currentPage: number;
    totalPages: number;
  };
}

export interface ErrorResponseGenerics<Code = string, Detail = unknown> {
  data: {
    code: Code;
    detail: Detail;
  };
}
