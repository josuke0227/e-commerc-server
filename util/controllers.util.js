exports.pickUserCredential = (user) => {
  const { _id, email, role } = user;

  return { id: _id, email, role };
};
