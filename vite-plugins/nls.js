import fs from 'node:fs';
import path from 'node:path';
import MagicString from 'magic-string';
export var Languages;
(function (Languages) {
    Languages["bg"] = "bg";
    Languages["cs"] = "cs";
    Languages["de"] = "de";
    Languages["en_gb"] = "en-gb";
    Languages["es"] = "es";
    Languages["fr"] = "fr";
    Languages["hu"] = "hu";
    Languages["id"] = "id";
    Languages["it"] = "it";
    Languages["ja"] = "ja";
    Languages["ko"] = "ko";
    Languages["nl"] = "nl";
    Languages["pl"] = "pl";
    Languages["ps"] = "ps";
    Languages["pt_br"] = "pt-br";
    Languages["ru"] = "ru";
    Languages["tr"] = "tr";
    Languages["uk"] = "uk";
    Languages["zh_hans"] = "zh-hans";
    Languages["zh_hant"] = "zh-hant";
})(Languages || (Languages = {}));
/**
 * 在vite中dev模式下会使用esbuild对node_modules进行预编译，导致找不到映射表中的filepath，
 * 需要在预编译之前进行替换
 * @param options 替换语言包
 * @returns
 */
export function esbuildPluginMonacoEditorNls(options) {
    options = Object.assign({ locale: Languages.en_gb }, options);
    const CURRENT_LOCALE_DATA = getLocalizeMapping(options.locale, options.localeData);
    return {
        name: 'esbuild-plugin-monaco-editor-nls',
        setup(build) {
            build.onLoad({ filter: /esm[/\\]vs[/\\]nls\.js/ }, async () => {
                return {
                    contents: getLocalizeCode(CURRENT_LOCALE_DATA),
                    loader: 'js',
                };
            });
            build.onLoad({ filter: /monaco-editor[/\\]esm[/\\]vs.+\.js/ }, async (args) => {
                return {
                    contents: transformLocalizeFuncCode(args.path, CURRENT_LOCALE_DATA),
                    loader: 'js',
                };
            });
        },
    };
}
/**
 * 使用了monaco-editor-nls的语言映射包，把原始localize(data, message)的方法，替换成了localize(path, data, defaultMessage)
 * vite build 模式下，使用rollup处理
 * @param options 替换语言包
 * @returns
 */
export default function (options) {
    options = Object.assign({ locale: Languages.en_gb }, options);
    const CURRENT_LOCALE_DATA = getLocalizeMapping(options.locale, options.localeData);
    return {
        name: 'rollup-plugin-monaco-editor-nls',
        enforce: 'pre',
        load(filepath) {
            if (/esm[/\\]vs[/\\]nls\.js/.test(filepath)) {
                return getLocalizeCode(CURRENT_LOCALE_DATA);
            }
        },
        transform(code, filepath) {
            if (/monaco-editor[/\\]esm[/\\]vs.+\.js/.test(filepath)
                && !/esm[/\\]vs[/\\].*nls\.js/.test(filepath)) {
                const re = /monaco-editor[/\\]esm[/\\](.+)(?=\.js)/;
                if (re.exec(filepath) && code.includes('localize(')) {
                    let path = RegExp.$1;
                    path = path.replaceAll('\\', '/');
                    code = code.replace(/localize\(/g, `localize('${path}', `);
                    return {
                        code: code,
                        /** 使用magic-string 生成 source map */
                        map: new MagicString(code).generateMap({
                            includeContent: true,
                            hires: true,
                            source: filepath,
                        }),
                    };
                }
            }
        },
    };
}
/**
 * 替换调用方法接口参数，替换成相应语言包语言
 * @param filepath 路径
 * @param CURRENT_LOCALE_DATA 替换规则
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transformLocalizeFuncCode(filepath, _CURRENT_LOCALE_DATA) {
    let code = fs.readFileSync(filepath, 'utf8');
    const re = /monaco-editor[/\\]esm[/\\](.+)(?=\.js)/;
    if (re.exec(filepath)) {
        let path = RegExp.$1;
        path = path.replaceAll('\\', '/');
        // if (filepath.includes('contextmenu')) {
        //     console.log(filepath);
        //     console.log(JSON.parse(CURRENT_LOCALE_DATA)[path]);
        // }
        // console.log(path, JSON.parse(CURRENT_LOCALE_DATA)[path])
        code = code.replace(/localize\(/g, `localize('${path}', `);
    }
    return code;
}
/**
 * 获取语言包
 * @param locale 语言
 * @param localeData
 * @returns
 */
function getLocalizeMapping(locale, localeData = undefined) {
    if (localeData)
        return JSON.stringify(localeData);
    // eslint-disable-next-line no-undef
    const locale_data_path = path.join(__dirname, `./locale/${locale}.json`);
    return fs.readFileSync(locale_data_path);
}
/**
 * 替换代码
 * @param CURRENT_LOCALE_DATA 语言包
 * @returns
 */
function getLocalizeCode(CURRENT_LOCALE_DATA) {
    return `
    /* ---------------------------------------------------------------------------------------------
    *  Copyright (c) Microsoft Corporation. All rights reserved.
    *  Licensed under the MIT License. See License.txt in the project root for license information.
    *--------------------------------------------------------------------------------------------*/
   let isPseudo = typeof document !== 'undefined' && document.location && document.location.hash.indexOf('pseudo=true') >= 0
   const DEFAULT_TAG = 'i-default'
   function _format(message, args) {
       let result
       if (args.length === 0) {
           result = message
       } else {
           result = message.replace(/{(\\d+)}/g, (match, rest) => {
               const index = rest[0]
               const arg = args[index]
               let result = match
               if (typeof arg === 'string') {
                   result = arg
               } else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
                   result = String(arg)
               }
   
               return result
           })
       }
       if (isPseudo) {
   
           // FF3B and FF3D is the Unicode zenkaku representation for [ and ]
           result = \`\uFF3B\${result.replace(/[aeiou]/g, '$&$&')}\uFF3D\`
       }
   
       return result
   }
   function findLanguageForModule(config, name) {
       let result = config[name]
       if (result) {
           return result
       }
       result = config['*']
       if (result) {
           return result
       }
   
       return null
   }
   function endWithSlash(path) {
       if (path.charAt(path.length - 1) === '/') {
           return path
       }
   
       return \`\${path}/\`
   }
   async function getMessagesFromTranslationsService(translationServiceUrl, language, name) {
       const url = \`\${endWithSlash(translationServiceUrl) + endWithSlash(language)}vscode/\${endWithSlash(name)}\`
       const res = await fetch(url)
       if (res.ok) {
           const messages = await res.json()
   
           return messages
       }
       throw new Error(\`\${res.status} - \${res.statusText}\`)
   }
   function createScopedLocalize(scope) {
       return function(idx, defaultValue) {
           const restArgs = Array.prototype.slice.call(arguments, 2)
   
           return _format(scope[idx], restArgs)
       }
   }
   function createScopedLocalize2(scope) {
       return (idx, defaultValue, ...args) => ({
           value: _format(scope[idx], args),
           original: _format(defaultValue, args),
       })
   }
   
   // export function localize(data, message, ...args) {
   //     return _format(message, args);
   // }

// ------------------------invoke----------------------------------------
    export function localize(path, data, defaultMessage, ...args) {
        var key = typeof data === 'object' ? data.key : data;
        var data = ${CURRENT_LOCALE_DATA} || {};
        var message = (data[path] || data?.contents?.[path] || {})[key];
        if (!message) {
            message = defaultMessage;
        }
        return _format(message, args);
    }
// ------------------------invoke----------------------------------------

   /**
    * @skipMangle
    */
   export function localize2(data, message, ...args) {
       const original = _format(message, args)
   
       return {
           value: original,
           original,
       }
   }
   
   /**
    * @skipMangle
    */
   export function getConfiguredDefaultLocale(_) {
   
       // This returns undefined because this implementation isn't used and is overwritten by the loader
       // when loaded.
       return undefined
   }
   
   /**
    * @skipMangle
    */
   export function setPseudoTranslation(value) {
       isPseudo = value
   }
   
   /**
    * Invoked in a built product at run-time
    * @skipMangle
    */
   export function create(key, data) {
       var _a
   
       return {
           localize: createScopedLocalize(data[key]),
           localize2: createScopedLocalize2(data[key]),
           getConfiguredDefaultLocale: (_a = data.getConfiguredDefaultLocale) !== null && _a !== void 0 ? _a : _ => undefined,
       }
   }
   
   /**
    * Invoked by the loader at run-time
    * @skipMangle
    */
   export function load(name, req, load, config) {
       var _a
       const pluginConfig = (_a = config['vs/nls']) !== null && _a !== void 0 ? _a : {}
       if (!name || name.length === 0) {
   
           // TODO: We need to give back the mangled names here
           return load({
               localize: localize,
               localize2: localize2,
               getConfiguredDefaultLocale: () => {
                   var _a
   
                   return (_a = pluginConfig.availableLanguages) === null || _a === void 0 ? void 0 : _a['*'] 
               },
           })
       }
       const language = pluginConfig.availableLanguages ? findLanguageForModule(pluginConfig.availableLanguages, name) : null
       const useDefaultLanguage = language === null || language === DEFAULT_TAG
       let suffix = '.nls'
       if (!useDefaultLanguage) {
           suffix = \`\${suffix}.\${language}\`
       }
       const messagesLoaded = messages => {
           if (Array.isArray(messages)) {
               messages.localize = createScopedLocalize(messages)
               messages.localize2 = createScopedLocalize2(messages)
           } else {
               messages.localize = createScopedLocalize(messages[name])
               messages.localize2 = createScopedLocalize2(messages[name])
           }
           messages.getConfiguredDefaultLocale = () => {
               var _a
   
               return (_a = pluginConfig.availableLanguages) === null || _a === void 0 ? void 0 : _a['*'] 
           }
           load(messages)
       }
       if (typeof pluginConfig.loadBundle === 'function') {
           pluginConfig.loadBundle(name, language, (err, messages) => {
   
               // We have an error. Load the English default strings to not fail
               if (err) {
                   req([\`\${name}.nls\`], messagesLoaded)
               } else {
                   messagesLoaded(messages)
               }
           })
       } else if (pluginConfig.translationServiceUrl && !useDefaultLanguage) {
           (async() => {
               var _a
               try {
                   const messages = await getMessagesFromTranslationsService(pluginConfig.translationServiceUrl, language, name)
   
                   return messagesLoaded(messages)
               } catch (err) {
   
                   // Language is already as generic as it gets, so require default messages
                   if (!language.includes('-')) {
                       console.error(err)
   
                       return req([\`\${name}.nls\`], messagesLoaded)
                   }
                   try {
   
                       // Since there is a dash, the language configured is a specific sub-language of the same generic language.
                       // Since we were unable to load the specific language, try to load the generic language. Ex. we failed to find a
                       // Swiss German (de-CH), so try to load the generic German (de) messages instead.
                       const genericLanguage = language.split('-')[0]
                       const messages = await getMessagesFromTranslationsService(pluginConfig.translationServiceUrl, genericLanguage, name);
   
                       // We got some messages, so we configure the configuration to use the generic language for this session.
                       (_a = pluginConfig.availableLanguages) !== null && _a !== void 0 ? _a : pluginConfig.availableLanguages = {}
                       pluginConfig.availableLanguages['*'] = genericLanguage
   
                       return messagesLoaded(messages)
                   } catch (err) {
                       console.error(err)
   
                       return req([\`\${name}.nls\`], messagesLoaded)
                   }
               }
           })()
       } else {
           req([name + suffix], messagesLoaded, err => {
               if (suffix === '.nls') {
                   console.error('Failed trying to load default language strings', err)
   
                   return
               }
               console.error(\`Failed to load message bundle for language \${language}. Falling back to the default language:\`, err)
               req([\`\${name}.nls\`], messagesLoaded)
           })
       }
   }  
    `;
}