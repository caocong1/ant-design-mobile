import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react'
import classNames from 'classnames'
import {useControllableValue} from 'ahooks'
import {withDefaultProps} from '../../utils/with-default-props'

const classPrefix = 'am-text-area'

export type TextAreaProps = Omit<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'onChange'
> & {
  onChange?: (val: string) => void
}

export type TextAreaRef = {
  clear: () => void
  focus: () => void
  blur: () => void
}

const defaultProps = {
  rows: 2,
}

// TODO: withDefaultProps 和 forwardRef 配合使用的问题
const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  (props: TextAreaProps & typeof defaultProps, ref) => {
    const {
      className,
      style,
      defaultValue: outerDefaultValue,
      value: outerValue,
      onChange: outerOnChange,
      rows: rows,
      ...textAreaProps
    } = props
    const [value, setValue] = useControllableValue<string>(props, {
      defaultValue: '',
    })
    const nativeTextAreaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      clear: () => {
        setValue('')
      },
      focus: () => {
        nativeTextAreaRef.current?.focus()
      },
      blur: () => {
        nativeTextAreaRef.current?.blur()
      },
    }))

    return (
      <div
        className={classNames(`${classPrefix}-wrapper`, className)}
        style={style}
      >
        <textarea
          ref={nativeTextAreaRef}
          {...textAreaProps}
          className={classPrefix}
          rows={rows}
          value={value}
          onChange={e => {
            setValue(e.target.value)
          }}
          onFocus={e => {
            props.onFocus?.(e)
          }}
          onBlur={e => {
            props.onBlur?.(e)
          }}
        />
      </div>
    )
  }
)

TextArea.defaultProps = defaultProps

export default TextArea
