export interface UseCase<T> {
  execute (input: any | string): Promise<T | string>
}
