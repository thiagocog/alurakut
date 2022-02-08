// parei ao minuto 1:14:35
// https://www.datocms.com/docs/content-management-api/resources/item/create#basic-example

import { SiteClient } from 'datocms-client'

export default async function RequestsReciver(req, res) {
  if (req.method === 'POST') {
    const TOKEN = '14dae3a52d1b6766d72604cee5b94d'
    const client = new SiteClient(TOKEN)
  
    const record = await client.items.create({
      itemType: '1736267',
      ...req.body
    })
      
    res.json({ record })
    return
  }

  res.status(404).json({
    message: '404 Not Found'
  })
}
