#ifndef CONTROLS_H
#define CONTROLS_H

#include <QString>
#include <QJsonObject>

class Controls
{
public:
    Controls(int key,QString label,QString name,int value);
    ~Controls();
    int getKey() const;
    void setKey(int value);

    QString getLabel() const;
    void setLabel(const QString &value);

    QString getName() const;
    void setName(const QString &value);

    int getValue() const;
    void setValue(int value);

    QJsonObject toJSON();

private:
    int key;
    QString label;
    QString name;
    int valueASCII;
};

#endif // CONTROLS_H
