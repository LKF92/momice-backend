function events(root, args, context) {
  return context.prisma.user({ id: root.id }).events();
}
module.exports = {
  events
};
