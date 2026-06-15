import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react'
import useAnimateRoute from '../../hooks/useAnimatedRoute';
import './gallerypage.css'
import { Logo } from '../../components'
import { KJUR } from 'jsrsasign';
// npm install --save gapi-script
import { privateData } from '../../config';
import { gapi } from 'gapi-script';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
window.Buffer = window.Buffer || require("buffer").Buffer;

// Justified gallery tuning (Flickr / Google Photos style).
const ROW_TARGET_HEIGHT = 240; // ideal row height in px before justification
const LIGHTBOX_WIDTH = 1600;   // full-res width served to the in-page lightbox on click
const ROW_GAP = 6;             // px gutter between photos, both axes
const DEFAULT_AR = 1.5;        // assumed aspect ratio until a photo's real one loads

// Greedily pack photos into rows, then scale each full row so it spans the
// container width exactly (flush left and right). Each photo keeps its aspect
// ratio, so nothing is cropped. The final partial row is left at the target
// height instead of being stretched, which avoids a giant trailing row.
function buildRows(items, arMap, containerWidth) {
  if (!containerWidth || items.length === 0) return [];
  const rows = [];
  let row = [];
  let arSum = 0;
  for (const item of items) {
    const ar = arMap[item.id] || DEFAULT_AR;
    row.push({ ...item, ar });
    arSum += ar;
    const naturalRowWidth = arSum * ROW_TARGET_HEIGHT + (row.length - 1) * ROW_GAP;
    if (naturalRowWidth >= containerWidth) {
      const height = (containerWidth - (row.length - 1) * ROW_GAP) / arSum;
      rows.push({ items: row, height });
      row = [];
      arSum = 0;
    }
  }
  if (row.length) {
    rows.push({ items: row, height: ROW_TARGET_HEIGHT });
  }
  return rows;
}

function GalleryPage() {
  const [images, setImages] = useState([]);
  const animationClass = useAnimateRoute()

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [arMap, setArMap] = useState({});

  // Track the container's inner width so rows can justify to it on resize.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Open a full-resolution in-page lightbox on click. One image at a time, so
  // it never triggers the bulk-thumbnail throttling that breaks the grid.
  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]', {});
    return () => {
      Fancybox.unbind('[data-fancybox="gallery"]');
      Fancybox.close();
    };
  }, []);

  // Record each photo's real aspect ratio once it loads, then reflow.
  const handleImgLoad = (id) => (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (!naturalWidth || !naturalHeight) return;
    const ar = naturalWidth / naturalHeight;
    setArMap((prev) => (prev[id] ? prev : { ...prev, [id]: ar }));
  };

  const photoItems = useMemo(
    () =>
      (images || [])
        .filter((it) => it.mimeType === 'image/jpeg' || it.mimeType === 'image/heif')
        .map((it) => ({
          id: it.id,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${it.id}`,
          lightboxUrl: `https://drive.google.com/thumbnail?id=${it.id}&sz=w${LIGHTBOX_WIDTH}`,
        })),
    [images]
  );

  const rows = useMemo(
    () => buildRows(photoItems, arMap, containerWidth),
    [photoItems, arMap, containerWidth]
  );

  const scope = 'https://www.googleapis.com/auth/drive.readonly    https://www.googleapis.com/auth/drive.metadata.readonly';

  function generateJWT() {
    const header = { "alg": "RS256", "typ": "JWT" }

    const payload = {
      "iss": privateData.iss,
      "scope": scope,
      "aud": "https://oauth2.googleapis.com/token",
      "exp": KJUR.jws.IntDate.get("now + 1hour"),
      "iat": KJUR.jws.IntDate.get("now")
    }

    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);

    var sJWS = KJUR.jws.JWS.sign(null, sHeader, sPayload, privateData.secret);


    return sJWS;
  }

  // Return the body as JSON if the request was successful, or thrown a StatusError.
  async function checkStatus(response) {
    if (!response.ok) {
      // Throw a StatusError if a non-OK HTTP status was returned.
      let message = "";
      try {
        // Try to parse the response body as JSON, in case the server returned a useful response.
        message = await response.json();
        console.log(`message: ${JSON.stringify(message)}`)
      } catch (err) {
        // Ignore if no JSON payload was retrieved and use the status text instead.
      }
      throw new Error(response.status, response.statusText, message);
    }

    // If the HTTP status is OK, return the body as JSON.
    return await response.json();
  }

  async function generateToken() {
    // Define the request body (URL-encoded)
    const jwt = generateJWT();

    const body = await new URLSearchParams({
      grant_type: `urn:ietf:params:oauth:grant-type:jwt-bearer`,
      assertion: jwt,
    });

    const searchResponse =
      await fetch('https://oauth2.googleapis.com/token', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

    return checkStatus(searchResponse)
  }

  async function getImages() {
    try {
      var request = gapi.client.request({
        'path': 'https://www.googleapis.com/drive/v3/files',
        'method': 'GET',
        'q': `${privateData.folderID} in parents`
      }).then(function (response) {
        var data = response.result.files;
        if (data && data.length > 0) {
          setImages(data);
          console.log("Images retrieved!");
        } else {
          console.log('No files found.');
        }

      });
    } catch (err) {
      console.log(err)
    }
  }

  async function initClient() {
    const parameters = {
      "scope": scope, "discoveryDocs": "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
    };

    try {
      gapi.client.init({
        'apiKey': privateData.apiKey,
        'clientId': privateData.clientId,
        'discoveryDocs': [parameters.discoveryDocs],
        'scope': parameters.scope,
      }).then(function () {
        const response = generateToken();
        response.then(function (result) {
          const json = JSON.parse(JSON.stringify(result));

          gapi.client.setToken({ access_token: json["access_token"] });

          gapi.client.load('drive', 'v2', getImages);
        })


      }, function (error) {
        console.log(JSON.stringify(error, null, 2));
      });
    } catch (e) {
      console.log(e);
    }
  }

  // Run the following upon page load 
  useEffect(() => {
    gapi.load('client', initClient);
  }, []);

  return (
    <div className={animationClass}>
      <div className='gallerypage-body'>
        <h1>Gallery</h1>
        <hr></hr>
        <p>Though I am just beginning my journey in photography, the allure of immortalizing the beauty of fleeting moments fuels my passion to persist.</p> 
        <p> So, here are all the photos that I am proud of.</p>
        <p>Camera: Olympus E-PL6</p>
        <p>Lens: Olympus E-PL6 Kit Lens 14-42mm</p>
        <br></br>
        <b><span id="images-count">{images ? Math.max(images.length - 1, 0) : 0}</span></b> imported pictures from Google Drive
        <div id="images-container" ref={containerRef}>
          {rows.map((row, ri) => (
            <div className="gallery-row" key={ri} style={{ height: row.height }}>
              {row.items.map((item) => (
                <a
                  key={item.id}
                  className="gallery-item"
                  style={{ width: item.ar * row.height }}
                  target="_blank"
                  rel="noreferrer"
                  href={item.lightboxUrl}
                  data-fancybox="gallery"
                  data-type="image"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={"a picture"}
                    className="thumbnail"
                    loading="lazy"
                    decoding="async"
                    onLoad={handleImgLoad(item.id)}
                  />
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Logo></Logo>
    </div>
  );
}

export default GalleryPage
