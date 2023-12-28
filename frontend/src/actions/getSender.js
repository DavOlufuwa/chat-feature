export const getSender = (loggedUser, chatUsers) => {
  return chatUsers[0].id === loggedUser.id
    ? chatUsers[1].name
    : chatUsers[0].name;
};

export const getSenderInfo = (loggedUser, chatUsers) => {
  return chatUsers[0].id === loggedUser.id
    ? chatUsers[1]
    : chatUsers[0];
}