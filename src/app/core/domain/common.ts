export interface DisabledInput {
  label : string
  text : string
}

export class TextInput implements DisabledInput {
  
  public text : string

  constructor(
    public label: string, 
    public value: string) {
      
      this.text = value.toString()
  }
}

export class NumberInput implements DisabledInput{
  
  public text : string

  constructor(
    public label: string, 
    public value: number = 0) {
      this.text = value.toString()
  }
}