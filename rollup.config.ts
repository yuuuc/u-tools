import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import ts from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
const env = process.env.NODE_ENV
const name = 'uTools'

const config = {
  // 入口
  input: path.resolve(__dirname, 'src/main.ts'),
  output: [
    // commonjs
    {
      file: pkg.main,
      format: 'cjs'
    },
    // esm
    {
      file: pkg.module,
      format: 'es'
    },
    // umd
    {
      name,
      file: pkg.umd,
      format: 'umd'
    }
  ],
  plugins: [
    // 解析第三方依赖
    resolve(),
    commonjs(),
    ts({}),
    babel({
      // 编译库使用
      babelHelpers: 'runtime',
      // 只转换源代码，不转换外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts']
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true
      }
    })
  )
}

export default config
