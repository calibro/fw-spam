module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? //? `${process.cwd()}/dist/`
        `/fw-spam/`
      : "/",
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Email reputation",
        mac: {
          icon: "build/mac-icon.png"
        },
        win: {
          icon: "build/win-icon.png"
        }
      }
    }
  }
};
