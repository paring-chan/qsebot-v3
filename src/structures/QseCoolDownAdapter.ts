import { CoolDownAdapter } from '@pikokr/command.ts'
import { CoolDown } from '../models'

export class QseCoolDownAdapter implements CoolDownAdapter {
    async get(id: string): Promise<number | undefined> {
        return (await CoolDown.findOne({ key: id }))?.value || undefined
    }

    async set(id: string, value: number): Promise<void> {
        let i = await CoolDown.findOne({ key: id })
        if (!i) {
            i = new CoolDown()
            i.key = id
        }
        i.value = value
        await i.save()
    }
}
