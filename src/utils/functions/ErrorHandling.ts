export default <Instance>(object: any): Instance => {
  const methods = Object.getOwnPropertyNames(object)

  methods.forEach(methodName => {
    const method = object[methodName] as Function

    if (typeof method !== "function" || methodName === "constructor") return

    object[methodName] = async (...params: any[]) => {
      try {
        return await Promise.resolve(method.apply(this, params))
      }
      catch (error) {
        for (const fn of params) {
          if (typeof fn === "function") {
            return fn(error)
          }
        }

        // const [req, res, next] = params
        // return next(error)
      }
    }
  })

  return object as Instance
}
