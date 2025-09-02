import { createContext, useContext, useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

const loadModel = async () => {
    const model = await tf.loadGraphModel('/model.json')
    return model
}

const ModelContext = createContext<tf.GraphModel | null>(null)

export const useModel = () => useContext(ModelContext)

export default function ModelProvider({ children }: { children: React.ReactNode }) {
    const [model, setModel] = useState<tf.GraphModel | null>(null)

    useEffect(() => {
        loadModel().then(mod => {
            setModel(mod)
        }).then(() => {
            const result = model?.predict(tf.zeros([1, 224, 224, 3])) as tf.Tensor
            result.dataSync()
        })

        return () => model?.dispose()
    }, [])

    return (
        <ModelContext.Provider value={model}>
            {children}
        </ModelContext.Provider>
    )
}