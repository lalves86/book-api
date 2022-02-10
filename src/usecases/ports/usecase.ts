export interface UseCase<T> {
  execute (input: T | string): Promise<T | string>
}
