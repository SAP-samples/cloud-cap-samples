const reducersFactory = (initialState, handlers) => {
  return (state = initialState, action) => {
    const handler = handlers[action.type];

    if (handler) {
      return handler(state, action);
    }

    return state;
  };
};

export { reducersFactory };
