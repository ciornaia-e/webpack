function createAnalytics(): object {
    let counter = 0
    let isDestroyed: boolean = false

    const LISTENER = (): number => counter++

    document.addEventListener('click', LISTENER)

    return {
        destroy() {
            document.removeEventListener('click', LISTENER)
            isDestroyed = true
        },

        getClicks() {
            if (isDestroyed) {
                return `Analytics is destroyed. Total clicks = ${counter}`            }
            return counter
        }
    }
}

window['analytics'] = createAnalytics()