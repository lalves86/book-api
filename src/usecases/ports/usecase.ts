export interface UseCase<T> {
  execute (input: T): Promise<T>
}
