import axios from 'axios'
import dotenv from 'dotenv'

import * as deepl from 'deepl-node'

dotenv.config()

const KEY = process.env.DEEPL_KEY!
const URL = process.env.DEEPL_URL!

const translator = new deepl.Translator(KEY);

const headers = {
    Authorization: `DeepL-Auth-Key ${KEY}`,
    'User-Agent': 'MyApp/1.2.3',
    'Content-Type': 'application/x-www-form-urlencoded'
}

type TypeLanguage = 'EN' | 'RU'

export const translate = async (text: string, target_lang: TypeLanguage) => {
    const data = new URLSearchParams({text, target_lang})

    // const response = await axios.post(URL, data, {headers})

    // const response = await translator.de

    // const response = await axios.post('https://api-free.deepl.com/v2/language', data, {headers})

    // console.log(response)

    // return response
}
