import { GoogleSpreadsheet } from 'google-spreadsheet'
import { fromBase64 } from '../../utils/base64'


const doc = new GoogleSpreadsheet(process.env.SHEET_DOC_ID)

export default async (req, res) => {
    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.SHEET_CLIENT_EMAIL,
            private_key: fromBase64(process.env.SHEET_PRIVATE_KEY)
        })

        await doc.loadInfo()

        const sheet = doc.sheetsByIndex[1]

        const rows = await sheet.getRows()
        const pratos = rows.map((res) => ({
            item: res.Nome,
            preco: res.Preço,
            desc: res.Descrição,
            desconto: res.Desconto,
            precoFinal: res.PrecoFinal,
            foto: res.Foto,
            qtd: 1
        }))
        res.json(pratos)
    } catch (err) {
        res.json({
            status: 'carregando...'
        })
    }

}