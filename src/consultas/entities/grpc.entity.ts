export interface GrpcEntity<T> {
  toGRPCMessage(): T;
}
