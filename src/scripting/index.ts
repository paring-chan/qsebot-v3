import { VM } from 'vm2'

export async function executeScript(script: string) {
    const vm = new VM({
        sandbox: {},
    })

    console.log(await vm.run(`(async () => {${script}})()`))
}

executeScript(`return '뭐요'`)
