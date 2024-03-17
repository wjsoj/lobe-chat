import { ActionIcon, Image } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Trash } from 'lucide-react';
import { CSSProperties, memo, useCallback } from 'react';

import { usePlatform } from '@/hooks/usePlatform';
import { useFileStore } from '@/store/file';

import { MIN_IMAGE_SIZE } from './style';

export const useStyles = createStyles(({ css, token }) => ({
  deleteButton: css`
    color: #fff;
    background: ${token.colorBgMask};

    &:hover {
      background: ${token.colorError};
    }
  `,
  editableImage: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorderSecondary};
  `,
  image: css`
    margin-block: 0 !important;
  `,
}));

interface FileItemProps {
  alwaysShowClose?: boolean;
  className?: string;
  editable?: boolean;
  id: string;
  onClick?: () => void;
  style?: CSSProperties;
}
const ImageFileItem = memo<FileItemProps>(({ editable, id, alwaysShowClose }) => {
  const [useFetchFile, removeFile] = useFileStore((s) => [s.useFetchFile, s.removeFile]);
  const IMAGE_SIZE = editable ? MIN_IMAGE_SIZE : '100%';
  const { data, isLoading } = useFetchFile(id);
  const { styles, cx } = useStyles();
  const { isSafari } = usePlatform();

  const handleRemoveFile = useCallback(
    (e: any) => {
      e.stopPropagation();
      removeFile(id);
    },
    [id],
  );

  const imageFileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.ico', '.webp', '.svg', '.eps', '.raw', '.heif', '.heic'];

  const isImage = (filename: string) => {
    const extension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    return imageFileExtensions.includes(`.${extension.toLowerCase()}`);
  }
  const isShowImage = isImage(data?.name);
  if (isShowImage) {
    return (
      <Image
        actions={
          editable && (
            <ActionIcon
              className={styles.deleteButton}
              glass
              icon={Trash}
              onClick={handleRemoveFile}
              size={'small'}
            />
          )
        }
        alt={data?.name || id || ''}
        alwaysShowActions={alwaysShowClose}
        height={isSafari ? 'auto' : '100%'}
        isLoading={isLoading}
        size={IMAGE_SIZE as any}
        src={data?.url}
        style={{ height: isSafari ? 'auto' : '100%' }}
        wrapperClassName={cx(styles.image, editable && styles.editableImage)}
      />
    );
  } else {
    <Image
      actions={
        editable && (
          <ActionIcon
            className={styles.deleteButton}
            glass
            icon={Trash}
            onClick={handleRemoveFile}
            size={'small'}
          />
        )
      }
      alt={data?.name || id || ''}
      alwaysShowActions={alwaysShowClose}
      height={isSafari ? 'auto' : '100%'}
      isLoading={isLoading}
      size={IMAGE_SIZE as any}
      src={data?.url}
      style={{ height: isSafari ? 'auto' : '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      wrapperClassName={cx(styles.image, editable && styles.editableImage)}
    />
  }
});

export default ImageFileItem;
