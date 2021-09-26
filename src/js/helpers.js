import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          // The Method Used
          method: 'POST',
          // What type of content it will be
          headers: {
            'Content-Type': 'application/json',
          },
          // The actual content
          body: JSON.stringify(uploadData),
        })
      : fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cross-Origin-Resource-Policy': 'cross-origin',
          },
        });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // convert api information using json
    const data = await res.json();

    // If there is an error
    if (!res) throw new Error(`Problem fetching API`);
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (error) {
    // Throw error to return to who is calling the function
    throw error;
  }
};
