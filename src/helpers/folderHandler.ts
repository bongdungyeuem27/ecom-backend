import fs from "fs";
export function create(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

export async function exists(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, (e) => {
      if (e) resolve(e);
      else reject(e);
    });
  });
}

export async function read(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function (error, content) {
      if (content) resolve(content);
      else reject(error);
    });
  });
}

export async function remove(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
}
