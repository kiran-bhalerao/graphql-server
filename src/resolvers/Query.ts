export const Query = {
  hello(parent: any, { name }: GQL.IHelloOnQueryArguments) {
    return `hey ${name || 'World'}`
  }
}
