export const isString = (value: any) => typeof value === "string"

export const isNull = (value: any): boolean => {

  let isNull = false
  switch (typeof value) {
    case "string": {
      isNull = value === ""
      break
    }

    case "number": {
      isNull = Boolean(value)
      break
    }

    case "object": {
      isNull = Object.values(value).length === 0 || Object.values(value).some(v => Boolean(v))
      break
    }

    default: {
      if (Array.isArray(value)) {
        isNull = value.length === 0
      }
      break
    }
  }

  return isNull
}