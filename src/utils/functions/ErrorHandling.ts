export default <Instance>(object: any): Instance => {
  const methods = Object.getOwnPropertyNames(object)

  methods.forEach(methodName => {
    const method = object[methodName] as Function

    if (typeof method !== "function" || methodName === "constructor") return

    object[methodName] = async (...params: any[]) => {
      try {
        return await Promise.resolve(method.call(this, ...params))
      }
      catch (error) {
        const [req, res, next] = params
        next(error)
      }
    }
  })

  return object as Instance
}
