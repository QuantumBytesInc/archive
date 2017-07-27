#include "../h/controls.h"

Controls::Controls(int key,QString label,QString name,int value)
{
    this->setKey(key);
    this->setLabel(label);
    this->setName(name);
    this->setValue(value);
}

Controls::~Controls()
{

}


int Controls::getKey() const
{
    return key;
}

void Controls::setKey(int value)
{
    key = value;
}
QString Controls::getLabel() const
{
    return label;
}

void Controls::setLabel(const QString &value)
{
    label = value;
}
QString Controls::getName() const
{
    return name;
}

void Controls::setName(const QString &value)
{
    name = value;
}
int Controls::getValue() const
{
    return valueASCII;
}

void Controls::setValue(int value)
{
    valueASCII = value;
}

QJsonObject Controls::toJSON()
{
    QJsonObject tmp;
    tmp.insert("key",QJsonValue(key));
    tmp.insert("label",QJsonValue(label));
    tmp.insert("name",QJsonValue(name));
    tmp.insert("value",QJsonValue(valueASCII));

    return tmp;
}



