import React, { useEffect, useState } from 'react'
import './gallerypage.css'
import { Navbar, Logo } from '../../components'
import { KJUR } from 'jsrsasign';
// npm install --save gapi-script
import { privateData } from '../../config';
import { gapi } from 'gapi-script';
window.Buffer = window.Buffer || require("buffer").Buffer;

function GalleryPage() {
  const [images, setImages] = useState([]);

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
    <div>
      <div className='body'>
        <h1>Gallery</h1>

        <p>I have only recently started to indulge in the art of photography. So, here is all the photos that I am proud of.</p>
        <p>Camera: Olympus E-PL6</p>
        <p>Lens: Olympus E-PL6 14-42mm</p>
        <br></br>
        <b><span id="images-count">{images ? Math.max(images.length - 1, 0) : 0}</span></b> imported pictures from Google Drive
        <div id="images-container">
          <br></br>
          {images && images.map((item, i) => {
            if (item.mimeType === 'image/jpeg' || item.mimeType === 'image/heif') {
              const thumbnailUrl = `https://drive.google.com/thumbnail?id=${item.id}`;
              const fullUrl = `https://drive.google.com/file/d/${item.id}/view?usp=drive_link`;

              return (
                <a key={i} target="_blank" href={fullUrl} data-fancybox="gallery">
                  <img src={thumbnailUrl} alt={"a picture"} className="img-fluid rounded thumbnail" />
                </a>
              );
            }
          })}
        </div>
      </div>
      <Logo></Logo>
    </div>
  );
}

export default GalleryPage
