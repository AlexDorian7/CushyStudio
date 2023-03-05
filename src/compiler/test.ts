import { readFileSync, writeFileSync } from 'fs'
import { demo } from './entry'

// console.log(demo.toJSON())

const nextOut = JSON.stringify(demo, null, 4)
writeFileSync('./src/compiler/entry.out.json', nextOut)
const prevOut = readFileSync('./src/compiler/entry.in.json', 'utf8')
if (prevOut === nextOut) {
    console.log('🟢 OK')
} else console.log('🔴 FAIL')
