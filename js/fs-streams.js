const fs = require('fs')

const append = (source, target) => {
  const read = fs.createReadStream(source)
  const write = fs.createWriteStream(target, {flags: 'a'})
  read.pipe(write)
}

const overwrite = (source, target) => {
  const read = fs.createReadStream(source)
  const write = fs.createWriteStream(target, {flags: 'w'})
  read.pipe(write)
}

append('./bash/bash_aliases', './appended')
overwrite('./bash/bash_aliases', './overwritten')
