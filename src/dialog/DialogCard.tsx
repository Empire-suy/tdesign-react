import React, { forwardRef, isValidElement } from 'react';
import classNames from 'classnames';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import {
  CloseIcon as TdCloseIcon,
  InfoCircleFilledIcon as TdInfoCircleFilledIcon,
  CheckCircleFilledIcon as TdCheckCircleFilledIcon,
} from 'tdesign-icons-react';
import Button, { ButtonProps } from '../button';
import { TdDialogCardProps } from './type';
import { StyledProps } from '../common';
import parseTNode from '../_util/parseTNode';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { dialogCardDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface DialogCardProps extends TdDialogCardProps, StyledProps, React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const renderDialogButton = (btn: DialogCardProps['cancelBtn'], defaultProps: ButtonProps) => {
  let result = null;

  if (isString(btn)) {
    result = <Button {...defaultProps}>{btn}</Button>;
  } else if (isValidElement(btn)) {
    result = btn;
  } else if (isObject(btn)) {
    result = <Button {...defaultProps} {...(btn as {})} />;
  } else if (isFunction(btn)) {
    result = btn();
  }

  return result;
};

const DialogCard = forwardRef<HTMLDivElement, DialogCardProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const componentCls = `${classPrefix}-dialog`;
  const { CloseIcon, InfoCircleFilledIcon, CheckCircleFilledIcon } = useGlobalIcon({
    CloseIcon: TdCloseIcon,
    InfoCircleFilledIcon: TdInfoCircleFilledIcon,
    CheckCircleFilledIcon: TdCheckCircleFilledIcon,
  });
  const [local, t] = useLocaleReceiver('dialog');
  const confirmText = t(local.confirm);
  const cancelText = t(local.cancel);

  const {
    theme,
    header,
    closeBtn,
    footer,
    body,
    children,
    className,
    onCancel,
    onConfirm,
    onCloseBtnClick,
    cancelBtn = cancelText,
    confirmBtn = confirmText,
    ...otherProps
  } = useDefaultProps<DialogCardProps>(props, dialogCardDefaultProps);

  const renderHeader = () => {
    if (!header) {
      return null;
    }

    const iconMap = {
      info: <InfoCircleFilledIcon className={`${classPrefix}-is-info`} />,
      warning: <InfoCircleFilledIcon className={`${classPrefix}-is-warning`} />,
      // error is going to deprecated
      error: <InfoCircleFilledIcon className={`${classPrefix}-is-error`} />,
      danger: <InfoCircleFilledIcon className={`${classPrefix}-is-error`} />,
      success: <CheckCircleFilledIcon className={`${classPrefix}-is-success`} />,
    };

    return (
      <div className={`${componentCls}__header-content`}>
        {iconMap[theme]}
        {header}
      </div>
    );
  };

  const renderCloseBtn = () => {
    if (!closeBtn) {
      return null;
    }

    const closeIcon = () => (closeBtn === true ? <CloseIcon /> : closeBtn);

    return (
      <span
        className={`${componentCls}__close`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => onCloseBtnClick?.({ e })}
      >
        {closeIcon()}
      </span>
    );
  };

  const renderFooter = () => {
    if (footer === false || footer === null) {
      return null;
    }

    const defaultFooter = () => {
      const renderCancelBtn = renderDialogButton(cancelBtn, {
        variant: 'outline',
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => onCancel?.({ e }),
      });
      const renderConfirmBtn = renderDialogButton(confirmBtn, {
        theme: 'primary',
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => onConfirm?.({ e }),
      });

      return (
        <>
          {renderCancelBtn}
          {renderConfirmBtn}
        </>
      );
    };

    return <div className={`${componentCls}__footer`}>{parseTNode(footer, null, defaultFooter())}</div>;
  };

  return (
    <div ref={ref} {...otherProps} className={classNames(componentCls, `${componentCls}--default`, className)}>
      <div className={classNames(`${componentCls}__header`)}>
        {renderHeader()}
        {renderCloseBtn()}
      </div>
      <div className={`${componentCls}__body`}>{body || children}</div>
      {renderFooter()}
    </div>
  );
});

DialogCard.displayName = 'DialogCard';

export default DialogCard;
