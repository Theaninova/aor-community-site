{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
  flake-utils.lib.eachDefaultSystem (system:
  let
    overlays = [ (import rust-overlay) ];
    pkgs = import nixpkgs { inherit system overlays; };
    unity-asset-ripper =
      let
        name = "unity-asset-ripper";
        version = "1.0.0";
        zip = pkgs.fetchzip {
          inherit name version;
          url = "https://github.com/AssetRipper/AssetRipper/releases/download/${version}/AssetRipper_linux_x64.zip";
          hash = "sha256-RyL8NF2rgHXzG7MF3EXq+gp4cyIyPe/ErEvVLWJSZns=";
        };
      in
      pkgs.appimageTools.wrapType2 {
        inherit name version;
        src = "${zip}/AssetRipper.GUI.Electron-1.0.0.AppImage";
      };
  in
  {
    devShell = pkgs.mkShell {
      buildInputs = (with pkgs; [
        nodejs_18
        unity-asset-ripper
      ]);
    };
  });
}
