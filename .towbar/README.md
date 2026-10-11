# Host the Cosmos catalogue

The Cosmos service builds this repository's fixtures with `pnpm cosmos:export` and serves the exported files with unprivileged nginx at `https://ds.oss.avgeek.ltd`. It uses pinned Node and nginx images, a frozen dependency lockfile, and port 8080. The runtime needs no application secrets, database, or persistent storage.

## Deploy with Towbar

1. Register and prepare the Platform Services server (`13.206.149.158`, Linux ARM64), or change the server and architecture in [the service manifest](services/cosmos.service.yml).
2. Connect this repository in Towbar and map `production` to `main`.
3. Configure Towbar's Cloudflare DNS integration for `avgeek.ltd`, and point `ds.oss.avgeek.ltd` at the target server. The service uses Cloudflare DNS validation for its TLS certificate.
4. Sync the repository and deploy the OSS Design System service manually. Automatic deployment is disabled in the manifest.
5. Check the HTTPS catalogue, open a fixture, switch themes, and confirm the fixture renderer loads. The exported catalogue uses query parameters for fixture selection; both `index.html` and `renderer.html` are served as static files.

The build has a 2 GiB memory limit; the static runtime has a 256 MiB limit. Keep room for the build alongside the server's existing workloads. This catalogue is public and contains fixture data. Do not put real credentials or production data in fixtures.

## Build locally

From the repository root:

```sh
docker build -f infra/cosmos/Dockerfile -t oss-design-system-cosmos .
docker run --rm -p 8080:8080 oss-design-system-cosmos
```

Open `http://localhost:8080`. HTML and the fixture renderer are revalidated on each visit; fingerprinted assets are cached for one year. Publishing the React package and deploying this catalogue are separate operations.
