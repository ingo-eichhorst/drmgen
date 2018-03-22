# DRM Encryption Key Generator (drmgen)
 
![license](https://img.shields.io/badge/license-MIT-green.svg) ![coverage](https://img.shields.io/badge/coverage-100%25-green.svg) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/e37a1ba496b4472794d9d5ecec3aba70)](https://app.codacy.com/app/ingo-eichhorst/drmgen?utm_source=github.com&utm_medium=referral&utm_content=ingo-eichhorst/drmgen&utm_campaign=badger)

The "drmgen" tool can be used to generate a set of keys to encrypt media files. The keys will beprovided in multiple formats. Every key consists of a "key id" a "key value" and (this is needed for HLS encryption) a "initialization vector". It is possible that the Involved Systems work with different endianess. Therefore the output is provided in little and big endian order.

## Quick Start

### CLI

To run drmgen as a CLI-Tool install it globally. You may need extended rights (sudo/admin) to do so.

#### Install

```bash
npm i -g drmgen
```

#### Usage

```bash
drmgen // Outputs: fullSet
```

### lib

To hook drmgen up to your awesome Javascipt/node.js project use the following

```JavaScript
const drm = require('drmgen')
console.log(drm.generateFullSet())
```

## swap/ flip - little and big endianess

It's possible that (license or DRM) systems that save keys to the host system, translate them to the network (host byte order to network byte order) or generate different versions of them internally. [I cannot really understand why this still happens - because it should be covered by the CPU and OS completely - but in reality it happens]

The problem for encrypting files is introduced if one system (let's say the license server) takes a key and swaps it internally, but another system (call it the content management system [CMS]) doesn't. If the CMS then allows a user to access the file with the un-swapped key the decryption of the file will not work because the key they have stored doesn't match. (Tasking about films you'll probably see a image stream full of strange artifacts)
This effact can also happen to the initalisation vector or the key id.

## Details about the CLI usage

### Output

- Key Id
- Key
- Initialisation Vector

- in spapped/ unswapped order
- in different encodings (hex, guid, base64)

### Calling from CLI with parameter

- f | format [output format] // output format multiline,json,oneline
- s | swap [output swapped ids] // adds swapped ids if set
- e | encoding [encoding to output] // output encodings (uuid, hex, base64, all)
- i | ids [types of ids] // included id types (key, id, iv)

```bash
drmgen -f multiline -s -e "uuid,base64" -i "id,key"
```
