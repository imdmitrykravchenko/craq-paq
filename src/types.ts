export type CraqPaqOptions = {
  cwd: string;
  src: {
    client: string;
    server: string;
  };
  output: {
    path: string;
    assets: string;
  };
  serve: {
    hostname: string;
    port: number;
  };
  silent: boolean;
  env: Record<string, Record<string, string>>;
  mode: "development" | "production";
};
